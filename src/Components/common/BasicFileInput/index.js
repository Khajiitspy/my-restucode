const BasicFileInput = ({ label, field, onChange, error, touched, required }) => {
    return (
        <div className="mb-3">
            <label htmlFor={field} className="form-label">{label}</label>
            <input
                type="file"
                name={field}
                id={field}
                className={`form-control ${touched && error ? 'is-invalid' : ''}`}
                accept="image/*"
                onChange={onChange}
                required={required}
            />
            {touched && error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};


export default BasicFileInput;
