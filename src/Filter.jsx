export function Filter({
  filter, name, handleClickOnFilter, text,
}) {
  return (
    <li>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        href="#"
        name={name}
        className={filter === name ? 'selected' : ''}
        onClick={handleClickOnFilter}
      >
        {text}
      </a>
    </li>
  );
}
