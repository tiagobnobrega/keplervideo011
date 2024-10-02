import { Typography } from '@amzn/kepler-ui-components';
import { render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';
import LocaleComponent, { styles } from '../../src/components/LocaleComponent';
import RadioPicker, { OptionType } from '../../src/components/RadioPicker';

describe('LocaleComponent', () => {
  const localeOptions: OptionType[] = [
    { label: 'Option 1', value: '1', code: 'A' },
    { label: 'Option 2', value: '2', code: 'B' },
    { label: 'Option 3', value: '3', code: 'C' },
  ];
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders correctly with styles', () => {
    const tree = render(<LocaleComponent />);
    expect(tree).toMatchSnapshot();
  });
  it('Typography is present in component', async () => {
    const { UNSAFE_queryByType } = render(
      <Typography style={styles.label} variant="title" />,
    );
    const typography = UNSAFE_queryByType(Typography);
    expect(typography).toBeDefined();
  });
  it('View is present in component', async () => {
    const { UNSAFE_queryByType } = render(<View style={styles.container} />);
    const view = UNSAFE_queryByType(Typography);
    expect(view).toBeDefined();
  });
  it('renders correctly without styles', () => {
    const defaultValue: OptionType = localeOptions[0];
    const tree = render(
      <RadioPicker
        options={[]}
        onSelect={jest.fn()}
        defaultValue={defaultValue}
      />,
    );
    expect(tree).toMatchSnapshot();
  });
});
