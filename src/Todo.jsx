export const Todo = ({ todo, handleClickOnCompleted, handleClickOnDelete, handleClickOnEdit, getLabel }) => {
    const label = getLabel(parseInt(todo.labelId))[0]

    return (
        <li key={todo.id} className={todo.completed ? "todo completed" : "todo"}>
            <div className="view" style={{ display: 'flex' }}>
                <div>
                    <input type="checkbox" className="toggle" checked={todo.completed} readOnly={true}
                           onClick={() => handleClickOnCompleted(todo)}/>
                    <label onClick={() => handleClickOnEdit(todo)}>
                        {todo.title}
                        <br/>
                        <span style={{ fontSize: 18 }}>{todo.description}</span>
                        <br/>
                        <span className="label">{label?.title}</span>
                        <br/>
                        <span style={{
                            fontSize: 20,
                            fontStyle: 'italic'
                        }}>{todo.dueDate !== "" ? new Date(todo.dueDate).toLocaleDateString() : ""}</span>
                    </label>
                </div>
                <div>
                    <button className="destroy" onClick={() => handleClickOnDelete(todo)}/>
                </div>
            </div>
            <input type="text" className="edit"/>
        </li>
    )
}
