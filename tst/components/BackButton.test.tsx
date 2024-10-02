import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import BackButton from '../../src/components/BackButton';

jest.mock('../../src/components/FocusableElement');
const onPressMock = jest.fn();
describe('BackButton renders correctly', () => {
  it('renders correctly without styles', () => {
    const tree = render(
      <BackButton onPress={onPressMock} hasTVPreferredFocus={true} />,
    );
    expect(tree).toMatchSnapshot();
  });
});
describe('BackButton with React.memo', () => {
  it('renders only when props change', async () => {
    const { rerender, UNSAFE_getByProps } = render(
      <BackButton onPress={onPressMock} hasTVPreferredFocus={true} />,
    );
    const isEqualSpy = jest.spyOn(require('lodash'), 'isEqual');
    rerender(<BackButton onPress={onPressMock} hasTVPreferredFocus={true} />);
    expect(isEqualSpy).toHaveBeenCalledWith(
      { hasTVPreferredFocus: true, onPress: onPressMock },
      { hasTVPreferredFocus: true, onPress: onPressMock },
    );
    rerender(<BackButton onPress={onPressMock} hasTVPreferredFocus={false} />);
    expect(isEqualSpy).toHaveBeenCalledWith(
      { hasTVPreferredFocus: true, onPress: onPressMock },
      { hasTVPreferredFocus: false, onPress: onPressMock },
    );
    expect(UNSAFE_getByProps({ hasTVPreferredFocus: false })).toBeTruthy();
  });
});
