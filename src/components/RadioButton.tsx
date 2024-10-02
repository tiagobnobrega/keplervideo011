import { isEqual } from 'lodash';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/Colors';
import { scaleUxToDp } from '../utils/pixelUtils';
import FocusableElement from './FocusableElement';

const RadioButton = ({
  label,
  onSelect,
  selected,
  testID,
}: {
  label: string;
  onSelect: () => void;
  selected?: boolean;
  testID: string;
}) => {
  return (
    <View style={styles.buttonContainer} testID={testID}>
      <FocusableElement
        onPress={onSelect}
        onFocusOverrideStyle={styles.focusedView}
        style={[styles.radioButton, selected && styles.radioButtonSelected]}
        testID={`radio-btn-${label}`}
      />
      <Text style={styles.label} testID={`radio-text-${label}`}>
        {label}
      </Text>
    </View>
  );
};

const radioBtnUnchanged = (
  prevProps: {
    label: string;
    onSelect: () => void;
    selected?: boolean;
  },
  nextProps: {
    label: string;
    onSelect: () => void;
    selected?: boolean;
  },
) => {
  return isEqual(prevProps, nextProps);
};

export default React.memo(RadioButton, radioBtnUnchanged);

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleUxToDp(15),
  },
  label: {
    fontSize: scaleUxToDp(27),
    color: COLORS.WHITE,
    marginLeft: scaleUxToDp(10),
  },
  focusedView: {
    borderColor: COLORS.YELLOW,
  },
  radioButton: {
    width: scaleUxToDp(30),
    height: scaleUxToDp(30),
    borderRadius: scaleUxToDp(15),
    borderWidth: 4,
    borderColor: COLORS.LIGHT_GRAY,
  },
  radioButtonSelected: {
    backgroundColor: COLORS.LIGHT_GRAY,
  },
});
