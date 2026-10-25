import { computed, onBeforeUnmount, ref } from 'vue'
import { sectionById } from '@/content/sections'
import type { SectionId, SectionPresentation } from '@/content/sections'
import { createSectionHashNavigation } from './sectionHash'

export function usePortfolio(applyPresentation: (presentation: SectionPresentation) => void) {
  const navigation =
    typeof window === 'undefined'
      ? undefined
      : createSectionHashNavigation(
          {
            read: () => window.location.hash,
            write(id, mode) {
              const url = `${window.location.pathname}${window.location.search}#${id}`
              if (mode === 'push') window.history.pushState(window.history.state, '', url)
              else window.history.replaceState(window.history.state, '', url)
            },
            subscribe(listener) {
              window.addEventListener('popstate', listener)
              window.addEventListener('hashchange', listener)
              return () => {
                window.removeEventListener('popstate', listener)
                window.removeEventListener('hashchange', listener)
              }
            },
          },
          (id) => {
            selectedSection.value = id
            applyPresentation(sectionById[id].presentation)
          },
        )
  const selectedSection = ref<SectionId>(navigation?.current ?? 'home')
  const section = computed(() => sectionById[selectedSection.value])
  const activeCard = computed(() => (selectedSection.value === 'home' ? null : section.value))

  if (selectedSection.value !== 'home') applyPresentation(section.value.presentation)

  function selectSection(id: SectionId) {
    if (selectedSection.value === id) return
    selectedSection.value = id
    navigation?.navigate(id)
    applyPresentation(sectionById[id].presentation)
  }

  function closeSection() {
    selectSection('home')
  }

  if (navigation) onBeforeUnmount(navigation.dispose)

  return {
    selectedSection,
    section,
    activeCard,
    selectSection,
    closeSection,
  }
}
