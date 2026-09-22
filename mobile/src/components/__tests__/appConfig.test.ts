import appConfig from '../../../app.config'

const { readFileSync } = jest.requireActual<{
  readFileSync(path: string): Uint8Array
}>('fs')
const { inflateSync } = jest.requireActual<{
  inflateSync(data: Uint8Array): Uint8Array
}>('zlib')

interface PngPixels {
  width: number
  height: number
  alpha: Uint8Array
}

function joinBytes(parts: Uint8Array[]): Uint8Array {
  const joined = new Uint8Array(parts.reduce((total, part) => total + part.length, 0))
  let offset = 0

  for (const part of parts) {
    joined.set(part, offset)
    offset += part.length
  }

  return joined
}

function paethPredictor(left: number, above: number, upperLeft: number): number {
  const prediction = left + above - upperLeft
  const distanceLeft = Math.abs(prediction - left)
  const distanceAbove = Math.abs(prediction - above)
  const distanceUpperLeft = Math.abs(prediction - upperLeft)

  if (distanceLeft <= distanceAbove && distanceLeft <= distanceUpperLeft) return left
  if (distanceAbove <= distanceUpperLeft) return above
  return upperLeft
}

function readPng(path: string): PngPixels {
  const png = readFileSync(path)
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength)
  const idatParts: Uint8Array[] = []
  let width = 0
  let height = 0
  let colorType = 0
  let offset = 8

  while (offset < png.length) {
    const length = view.getUint32(offset)
    const type = String.fromCharCode(...png.slice(offset + 4, offset + 8))
    const data = png.slice(offset + 8, offset + 8 + length)

    if (type === 'IHDR') {
      const header = new DataView(data.buffer, data.byteOffset, data.byteLength)
      width = header.getUint32(0)
      height = header.getUint32(4)
      expect(data[8]).toBe(8)
      colorType = data[9]
      expect([2, 6]).toContain(colorType)
      expect(data[12]).toBe(0)
    }
    if (type === 'IDAT') idatParts.push(data)
    if (type === 'IEND') break

    offset += length + 12
  }

  const channels = colorType === 6 ? 4 : 3
  const stride = width * channels
  const inflated = inflateSync(joinBytes(idatParts))
  const reconstructed = new Uint8Array(height * stride)

  for (let row = 0; row < height; row += 1) {
    const sourceStart = row * (stride + 1)
    const filter = inflated[sourceStart]

    for (let column = 0; column < stride; column += 1) {
      const raw = inflated[sourceStart + column + 1]
      const target = row * stride + column
      const left = column >= channels ? reconstructed[target - channels] : 0
      const above = row > 0 ? reconstructed[target - stride] : 0
      const upperLeft =
        row > 0 && column >= channels ? reconstructed[target - stride - channels] : 0
      let value = raw

      if (filter === 1) value += left
      else if (filter === 2) value += above
      else if (filter === 3) value += Math.floor((left + above) / 2)
      else if (filter === 4) value += paethPredictor(left, above, upperLeft)

      reconstructed[target] = value & 0xff
    }
  }

  const alpha = new Uint8Array(width * height)
  for (let pixel = 0; pixel < alpha.length; pixel += 1) {
    alpha[pixel] = channels === 4 ? reconstructed[pixel * channels + 3] : 255
  }

  return { width, height, alpha }
}

describe('native brand configuration', () => {
  it('publishes the official icon, adaptive icon, splash, favicon, and scheme', () => {
    const config = appConfig({ config: {} } as never)

    expect(config.scheme).toBe('aikuaa')
    expect(config.icon).toBe('./assets/brand/aikuaa-icon-ios.png')
    expect(config.ios?.icon).toBe('./assets/brand/aikuaa-icon-ios.png')
    expect(config.plugins).toContainEqual([
      'expo-splash-screen',
      {
        image: './assets/brand/aikuaa-splash-mark.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#FAF9F6',
      },
    ])
    expect(config.android?.adaptiveIcon).toEqual({
      foregroundImage: './assets/brand/aikuaa-adaptive-foreground.png',
      backgroundColor: '#FAF9F6',
    })
    expect(config.web?.favicon).toBe('./assets/brand/aikuaa-icon.png')
  })

  it('uses an opaque 1024px iOS icon', () => {
    const icon = readPng('assets/brand/aikuaa-icon-ios.png')

    expect(icon).toMatchObject({ width: 1024, height: 1024 })
    expect(icon.alpha.every((alpha) => alpha === 255)).toBe(true)
  })

  it('keeps the unmasked Android owl inside the adaptive safe zone', () => {
    const foreground = readPng('assets/brand/aikuaa-adaptive-foreground.png')
    const safeInset = Math.ceil((foreground.width * 21) / 108)
    let opaquePixels = 0
    let opaquePixelsOutsideSafeZone = 0

    for (let y = 0; y < foreground.height; y += 1) {
      for (let x = 0; x < foreground.width; x += 1) {
        const alpha = foreground.alpha[y * foreground.width + x]
        if (alpha === 0) continue

        opaquePixels += 1
        if (
          x < safeInset ||
          y < safeInset ||
          x >= foreground.width - safeInset ||
          y >= foreground.height - safeInset
        ) {
          opaquePixelsOutsideSafeZone += 1
        }
      }
    }

    expect(foreground).toMatchObject({ width: 432, height: 432 })
    expect(opaquePixels).toBeGreaterThan(0)
    expect(opaquePixelsOutsideSafeZone).toBe(0)
    expect(opaquePixels).toBeLessThan(foreground.width * foreground.height * 0.5)
  })

  it('uses a dedicated transparent splash mark', () => {
    const splash = readPng('assets/brand/aikuaa-splash-mark.png')
    const transparentPixels = splash.alpha.filter((alpha) => alpha === 0).length
    const opaquePixels = splash.alpha.filter((alpha) => alpha > 0).length

    expect(splash).toMatchObject({ width: 820, height: 654 })
    expect(transparentPixels).toBeGreaterThan(0)
    expect(opaquePixels).toBeGreaterThan(0)
  })
})
