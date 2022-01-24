export const Filter = ({ filter, name, handleClickOnFilter, text }) => {
    return (
        <li><a href="#" name={name} className={filter === name ? "selected" : ""}
               onClick={handleClickOnFilter}>{text}</a>
        </li>
    )
}
