import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  it('56. value prop is reflected in input value', () => {
    render(<SearchBar value="부산" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('부산')
  })

  it('57. typing calls onChange with the typed string', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)
    await user.type(screen.getByRole('textbox'), '서울')
    expect(onChange).toHaveBeenCalled()
    // last call should have the last character typed
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall).toBe('울')
  })

  it('58. input has aria-label="도시 검색"', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByLabelText('도시 검색')).toBeInTheDocument()
  })

  it('59. renders a "검색" button', () => {
    render(<SearchBar value="" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: '검색' })).toBeInTheDocument()
  })
})
