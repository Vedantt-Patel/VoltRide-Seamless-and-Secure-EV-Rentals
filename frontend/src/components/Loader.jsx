import "./Loader.css" // You'll need to create this CSS file

const Loader = ({ message = "Processing your registration..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-spinner">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default Loader

