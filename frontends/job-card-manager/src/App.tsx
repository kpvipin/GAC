import { Box } from "@mui/material"
import TopBar from "./Components/Common/TopBar";
import SideBar from "./Components/Common/Sidebar";

function App() {

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <SideBar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
          
        </Box>
      </Box>
    </Box>
  )
}

export default App
