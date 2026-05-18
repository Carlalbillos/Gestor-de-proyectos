import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DetailsHeader } from './details-header';


describe('DetailsHeader', () => {
  const title = 'Test Title'


  it('should render the title (h1) correctly', () => {
    const { container } = render(<DetailsHeader title={title} onBack={() => { }} />)
    const div = container.querySelector('div');
    const h1 = div.querySelector('h1');


    expect(h1).not.toBeNull();
  });


  it('should render the subtitle (div) when provided', () => {
    const { container } = render(<DetailsHeader subTitle='subTitle' title={title} onBack={() => { }} />)
    const div = container.querySelector('div');


    expect(div).not.toBeNull();
  });


  it('should not render subtitle when not provided', () => {
    const { container } = render(<DetailsHeader title={title} onBack={() => { }} />)
    const div = container.querySelector('div');
    const p = div.querySelector('p');


    expect(p).toBeNull();
  });


  it('should not render buttons when showActions is false', () => {
    const { container } = render(<DetailsHeader title={title} showActions={false} onBack={() => { }} />)
    const div = container.querySelector('div');
    const button = div.querySelector('button');


    expect(button).not.toBeDefined();
  });



});