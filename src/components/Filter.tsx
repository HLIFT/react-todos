type FilterProps = {
    filter: string | number,
    name: string | number,
    handleClickOnFilter: (name: string | number) => void,
    text: string
}

export function Filter({
  filter, name, handleClickOnFilter, text,
}: FilterProps) {
  return (
    <li>
      <button
        type="button"
        className={filter === name ? 'selected' : ''}
        onClick={() => handleClickOnFilter(name)}
      >
        {text}
      </button>
    </li>
  );
}
