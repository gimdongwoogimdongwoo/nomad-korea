import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GaugeBar } from './GaugeBar'

function getFilledCells(colorClass: string) {
  const meter = screen.getByRole('meter')
  return Array.from(meter.children).filter(c => c.classList.contains(colorClass))
}

function getEmptyCells() {
  const meter = screen.getByRole('meter')
  return Array.from(meter.children).filter(c => c.classList.contains('bg-muted'))
}

describe('GaugeBar', () => {
  it('37. renders exactly 10 cells total', () => {
    render(<GaugeBar score={5} />)
    const meter = screen.getByRole('meter')
    expect(meter.children).toHaveLength(10)
  })

  it('38. score=7 → 7 filled, 3 empty', () => {
    render(<GaugeBar score={7} colorScheme="blue" />)
    expect(getFilledCells('bg-blue-500')).toHaveLength(7)
    expect(getEmptyCells()).toHaveLength(3)
  })

  it('39. score=0 → 0 filled, 10 empty', () => {
    render(<GaugeBar score={0} colorScheme="blue" />)
    expect(getFilledCells('bg-blue-500')).toHaveLength(0)
    expect(getEmptyCells()).toHaveLength(10)
  })

  it('40. score=10 → 10 filled, 0 empty', () => {
    render(<GaugeBar score={10} colorScheme="blue" />)
    expect(getFilledCells('bg-blue-500')).toHaveLength(10)
    expect(getEmptyCells()).toHaveLength(0)
  })

  it('41. score=11 → clamped to 10 → 10 filled', () => {
    render(<GaugeBar score={11} colorScheme="blue" />)
    expect(getFilledCells('bg-blue-500')).toHaveLength(10)
  })

  it('42. score=-1 → clamped to 0 → 0 filled', () => {
    render(<GaugeBar score={-1} colorScheme="blue" />)
    expect(getFilledCells('bg-blue-500')).toHaveLength(0)
  })

  it('43. score=7.6 → Math.round → 8 filled', () => {
    render(<GaugeBar score={7.6} colorScheme="blue" />)
    expect(getFilledCells('bg-blue-500')).toHaveLength(8)
  })

  it('44. score=7.4 → Math.round → 7 filled', () => {
    render(<GaugeBar score={7.4} colorScheme="blue" />)
    expect(getFilledCells('bg-blue-500')).toHaveLength(7)
  })

  it('45. label prop present → label text rendered', () => {
    render(<GaugeBar score={5} label="1Gbps" />)
    expect(screen.getByText('1Gbps')).toBeInTheDocument()
  })

  it('46. label prop absent → no label text', () => {
    render(<GaugeBar score={5} />)
    const meter = screen.getByRole('meter')
    // only the meter itself should be in the container, no extra text spans
    expect(screen.queryByText(/Gbps|Mbps/)).not.toBeInTheDocument()
  })

  it('47. colorScheme="blue" → filled cells have bg-blue-500', () => {
    render(<GaugeBar score={3} colorScheme="blue" />)
    expect(getFilledCells('bg-blue-500')).toHaveLength(3)
  })

  it('48. colorScheme="green" → filled cells have bg-green-500', () => {
    render(<GaugeBar score={3} colorScheme="green" />)
    expect(getFilledCells('bg-green-500')).toHaveLength(3)
  })

  it('49. meter has correct aria attributes', () => {
    render(<GaugeBar score={7} label="테스트" />)
    const meter = screen.getByRole('meter')
    expect(meter).toHaveAttribute('aria-valuenow', '7')
    expect(meter).toHaveAttribute('aria-valuemin', '0')
    expect(meter).toHaveAttribute('aria-valuemax', '10')
  })
})
