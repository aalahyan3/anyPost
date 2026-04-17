export function validateName(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return "Project name is required."
  if (trimmed.length < 3) return "Project name must be at least 3 characters long."
  if (trimmed.length > 20) return "Project name must be 20 characters or fewer."
  return null
}

export function extractFieldErrors(err: any): { name?: string; general?: string } {
  const data = err?.response?.data
  if (!data) return { general: "An unexpected error occurred." }
  
  const nameErr = data.errors?.name
  if (nameErr) return { name: nameErr, general: data.message }
  
  return { general: data.message || "Something went wrong." }
}
