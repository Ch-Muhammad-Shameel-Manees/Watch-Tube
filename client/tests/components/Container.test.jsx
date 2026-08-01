import { render, screen } from '@testing-library/react'
import { Container } from '../../src/components/ui';
import { describe, expect, it } from 'vitest';

describe("Container", () => {
    it("should display the children prop passed to container", () => {
        const children = "Hello there!"

        render(<Container> {children} </Container>);

        expect(screen.getByText(children)).toHaveTextContent(children);
    })
})