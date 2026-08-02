export const FormFeedback = ({
  message,
  colorClass,
}: {
  message: string
  colorClass: string
}) => {
  return <span className={`${colorClass} text-xl h-8`}>{message}</span>
}
