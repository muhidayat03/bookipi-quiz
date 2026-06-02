import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys, addQuestion, updateQuestion, deleteQuestion } from '@/api'

export const useAddQuestion = (quizId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Parameters<typeof addQuestion>[1]) => addQuestion(quizId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quiz(quizId) }),
  })
}

export const useUpdateQuestion = (quizId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateQuestion>[1] }) =>
      updateQuestion(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.quiz(quizId) }),
  })
}

export const useDeleteQuestion = (quizId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteQuestion(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.quiz(quizId) })
      const previous = qc.getQueryData<{ questions: { id: number }[] }>(queryKeys.quiz(quizId))
      qc.setQueryData<{ questions: { id: number }[] }>(queryKeys.quiz(quizId), (old) => {
        if (!old) return old
        return { ...old, questions: old.questions.filter((q) => q.id !== id) }
      })
      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) qc.setQueryData(queryKeys.quiz(quizId), context.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: queryKeys.quiz(quizId) }),
  })
}
