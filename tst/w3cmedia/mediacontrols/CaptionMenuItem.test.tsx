/*
 * Copyright (c) 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native';
import React from 'react';
import CaptionMenuItem from '../../../src/w3cmedia/mediacontrols/CaptionMenuItem';
import { CaptionMenuItemProps } from '../../../src/w3cmedia/mediacontrols/types/Captions';

const onPressMock = jest.fn();
const renderCaptionButton = (props?: Partial<CaptionMenuItemProps>) => {
  return (
    <CaptionMenuItem text={'Some Text'} onPress={onPressMock} {...props} />
  );
};
describe('CaptionMenuItem tests', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
  });
  it('component renders correctly with select', () => {
    const component = render(renderCaptionButton({ selected: true }));
    expect(component).toMatchSnapshot();
  });
});
