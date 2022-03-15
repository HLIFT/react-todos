// eslint-disable-next-line max-len
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions,jsx-a11y/click-events-have-key-events,jsx-a11y/label-has-associated-control */
export function Todo({
  todo,
  handleClickOnCompleted,
  handleClickOnDelete,
  handleClickOnEdit,
  getLabel,
}) {
  const label = todo.labelId ? getLabel(parseInt(todo.labelId, 10))[0] : null;

  return (
    <li key={todo.id} className={todo.completed ? 'todo completed' : 'todo'}>
      <div className="view" style={{ display: 'flex' }}>
        <div>
          <input
            type="checkbox"
            className="toggle"
            checked={todo.completed}
            readOnly
            onClick={() => handleClickOnCompleted(todo)}
          />
          <label onClick={() => handleClickOnEdit(todo)}>
            {todo.title}
            {todo.description && todo.description !== '' ?
              <div><span style={{ fontSize: 18 }}>{todo.description}</span></div> : null}
            {label ? <div><span className="label"
                                style={{ backgroundColor: label ? label.color : "gray" }}>{label?.name}</span>
            </div> : <div><span className="label"
                                style={{ backgroundColor: "lightgrey" }}>Non classé</span>
            </div>}
            <span
              style={{
                fontSize: 20,
                fontStyle: 'italic',
              }}
            >
              {todo.dueDate !== ''
                ? new Date(todo.dueDate).toLocaleDateString()
                : ''}
            </span>
          </label>
        </div>
        <div>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            type="button"
            className="destroy"
            onClick={() => handleClickOnDelete(todo)}
          />
        </div>
      </div>
      <input type="text" className="edit"/>
    </li>
  );
}
