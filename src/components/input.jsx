const Input = ({ type, name, value, onChange, onBlur, error, placeholder, label }) => {
    return(
        <>
            <label htmlFor={name}>{label}</label>
            <input id={name} placeholder={placeholder} type={type} name={name} value={value} onChange={onChange} onBlur={onBlur}/>
            {error && <div id="feedback">{error}</div>}
        </>

    )
}

export default Input