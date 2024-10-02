import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import RadioButton from '../../src/components/RadioButton';

describe('RadioButton renders correctly', () => {
  it('renders correctly without styles', () => {
    const tree = render(
      <RadioButton label={''} onSelect={jest.fn()} testID={'radio-button-1'} />,
    );
    expect(tree).toMatchSnapshot();
  });
});

describe('RadioButton with React.memo', () => {
  it('renders only when props change', async () => {
    const label = 'test';
    const mockOnSelect = jest.fn();
    const { rerender } = render(
      <RadioButton
        label={''}
        onSelect={mockOnSelect}
        testID={'radio-button-1'}
      />,
    );
    const isEqualSpy = jest.spyOn(require('lodash'), 'isEqual');
    rerender(
      <RadioButton
        label={''}
        onSelect={mockOnSelect}
        testID={'radio-button-1'}
      />,
    );
    expect(isEqualSpy).toHaveBeenCalledTimes(1);
    rerender(
      <RadioButton
        label={label}
        onSelect={mockOnSelect}
        testID={'radio-button-1'}
      />,
    );
    expect(isEqualSpy).toHaveBeenCalledTimes(2);
    isEqualSpy.mockRestore();
  });
});
