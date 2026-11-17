import { useQuery } from '@tanstack/react-query'
import { listCollaborators } from '@/lib/api'

export function useCollaborators() {
  return useQuery({ queryKey: ['collaborators'], queryFn: listCollaborators })
}
