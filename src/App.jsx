import { BrowserRouter } from "react-router-dom"
import Navbar from "./components/ui/app/navbar"

function App() {
  return (
    <BrowserRouter>
      <div className="p-4">
          <Navbar />
      </div>
    </BrowserRouter>
  )
}

export default App
