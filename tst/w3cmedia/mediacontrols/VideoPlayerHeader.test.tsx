/*
 * Copyright (c) 2024 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
import { describe } from '@jest/globals';
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native';
import React from 'react';
import Header from '../../../src/w3cmedia/mediacontrols/VideoPlayerHeader';

const mockNavigateBack = jest.fn();
const renderCaptionButton = () => {
  return <Header title={'Some Title'} navigateBack={mockNavigateBack} />;
};
describe('Header tests', () => {
  it('component renders correctly', () => {
    const component = render(renderCaptionButton());
    expect(component).toMatchSnapshot();
  });
});
