// File name: FormInput
// File name with extension: FormInput.jsx
// Full path: E:\cloud_ShubhamJadhav\client\src\components\form\FormInput.jsx
// Directory: E:\cloud_ShubhamJadhav\client\src\components\form

const FormInput = ({ label, name, type, defaultValue, size }) => {
  return (
    <div className="form-control ">
      <label className="label">
        <span className="label-text capitalize">{label}</span>
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        className={` input input-bordered ${size}`}
      />
    </div>
  );
};
export default FormInput;
