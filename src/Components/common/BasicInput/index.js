

const BasicInput = ({ label, field, value, onChange, onBlur, error, touched, required }) => {
    return (
        <div className="mb-3">
            <label htmlFor={field} className="form-label">{label}</label>
            <input
                type="text"
                className={`form-control ${touched && error ? 'is-invalid' : ''}`}
                id={field}
                name={field}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
            />
            {touched && error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};

export default BasicInput;
