import "./App.css";
import PhotoGallery from "./components/PhotoGallery";

function App() {
  return (
    <>
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-center text-2xl font-bold">Photo Gallery</h1>
        <PhotoGallery />
      </div>
    </>
  );
}

export default App;
