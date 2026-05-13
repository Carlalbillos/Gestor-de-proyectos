import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DetailsHeader } from './details-header';

describe('DetailsHeader', () => {
  const title = 'Test Title'
  test('should render the title correctly', () => {
    const { container } = render(<DetailsHeader title={title} onBack={() => { }} />)
    const divElement = container.querySelector('div');
    const h1 = divElement.querySelector('h1');

    expect(h1).not.toBeNull();
  });

  test('should render the subtitle when provided', () => {
    const { container } = render(<DetailsHeader subTitle='subTitle' title={title} onBack={() => { }} />)
    const divElement = container.querySelector('div');

    expect(divElement).not.toBeNull();
  });

  test('should not render subtitle when not provided', () => {
    const { container } = render(<DetailsHeader title={title} onBack={() => { }} />)
    const divElement = container.querySelector('div');
    const pElement = divElement.querySelector('p');

    expect(pElement).toBeNull();
  });


});