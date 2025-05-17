const basicInput = ({label,onChange}) => {
    return (
        <>
            <div className="mb-3">
                <label className="form-label">{label}</label>
                <input
                    type="file"
                    className="form-control"
                    onChange={onChange}
                    accept="image/*"
                    required
                />
            </div>
        </>
    )
}

export default basicInput;