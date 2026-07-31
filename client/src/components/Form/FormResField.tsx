export const FormResField = ({
  res,
  color,
}: {
  res: string
  color: string
}) => {
  return <span className={`${color} text-xl h-8`}>{res}</span>
}
