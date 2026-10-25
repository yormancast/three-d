import { describe, expect, it, vi } from 'vitest'
import { usePortfolio } from './usePortfolio'
import { sectionById } from '@/content/sections'

describe('usePortfolio', () => {
  it('changes the selected section and card immediately without waiting for the scene', () => {
    const applyPresentation = vi.fn()
    const portfolio = usePortfolio(applyPresentation)

    portfolio.selectSection('bio')

    expect(portfolio.selectedSection.value).toBe('bio')
    expect(portfolio.section.value).toBe(sectionById.bio)
    expect(portfolio.activeCard.value).toBe(sectionById.bio)
    expect(applyPresentation).toHaveBeenCalledWith(sectionById.bio.presentation)
  })

  it('returns to Home when the card closes and hides the Home card', () => {
    const applyPresentation = vi.fn()
    const portfolio = usePortfolio(applyPresentation)

    expect(portfolio.activeCard.value).toBeNull()
    portfolio.selectSection('projects')
    portfolio.closeSection()

    expect(portfolio.selectedSection.value).toBe('home')
    expect(portfolio.section.value).toBe(sectionById.home)
    expect(portfolio.activeCard.value).toBeNull()
    expect(applyPresentation).toHaveBeenLastCalledWith(sectionById.home.presentation)
  })

  it('does not emit a duplicate presentation when selecting the current section', () => {
    const applyPresentation = vi.fn()
    const portfolio = usePortfolio(applyPresentation)

    portfolio.selectSection('home')
    portfolio.selectSection('bio')
    portfolio.selectSection('bio')

    expect(applyPresentation).toHaveBeenCalledOnce()
  })

  it('keeps the latest UI selection across rapid changes', () => {
    const applyPresentation = vi.fn()
    const portfolio = usePortfolio(applyPresentation)

    portfolio.selectSection('bio')
    portfolio.selectSection('contact')

    expect(portfolio.activeCard.value).toBe(sectionById.contact)
    expect(applyPresentation).toHaveBeenLastCalledWith(sectionById.contact.presentation)
  })
})
