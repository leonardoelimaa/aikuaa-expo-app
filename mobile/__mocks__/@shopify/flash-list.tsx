import React from 'react'
import { FlatList, type FlatListProps } from 'react-native'

export interface FlashListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  data: T[]
  renderItem: (info: { item: T; index: number }) => React.ReactElement | null
  getItemType?: (item: T, index: number) => string
}

export const FlashList = React.forwardRef<FlatList<unknown>, FlashListProps<unknown>>(
  (props, ref) => {
    return (
      <FlatList
        ref={ref as React.RefObject<FlatList<unknown>>}
        {...props}
        initialNumToRender={props.data.length}
        testID={props.testID ?? 'flash-list'}
      />
    )
  },
)
FlashList.displayName = 'FlashList'

export type ListRenderItem<T> = (info: { item: T; index: number }) => React.ReactElement | null
