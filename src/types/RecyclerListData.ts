import { StyleProp, ViewStyle } from 'react-native';
import { RecyclerListViewProps } from 'recyclerlistview';

export interface CustomRecyclerListViewProps extends RecyclerListViewProps {
  contentContainerStyle?: StyleProp<ViewStyle>;
  initialNumToRender: number | undefined;
}
