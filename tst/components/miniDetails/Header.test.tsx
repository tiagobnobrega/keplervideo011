import { render } from '@testing-library/react-native';
import React from 'react';
import 'react-native';
import Header from '../../../src/components/miniDetails/Header';
import { tileData } from '../../../src/data/tileData';

describe('Header renders correctly', () => {
  it('renders correctly without styles', () => {
    const tree = render(<Header />);
    expect(tree).toMatchSnapshot();
  });
});
describe('Header with React.memo', () => {
  it('renders only when props change', async () => {
    const tileDataTwo = { ...tileData, id: '169314' };
    const isEqualSpy = jest.spyOn(require('lodash'), 'isEqual');
    const { rerender, UNSAFE_getByProps } = render(<Header data={tileData} />);
    rerender(<Header data={tileData} />);
    expect(isEqualSpy).toHaveBeenCalledWith(tileData, tileData);
    rerender(<Header data={tileDataTwo} />);
    expect(isEqualSpy).toHaveBeenCalledWith(tileData, tileDataTwo);
    expect(UNSAFE_getByProps({ data: tileDataTwo })).toBeTruthy();
  });
});
