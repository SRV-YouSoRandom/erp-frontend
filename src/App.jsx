import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import GroupsPage from './pages/GroupsPage'
import JournalEntriesPage from './pages/JournalEntriesPage'
import SendAndRecordPage from './pages/SendAndRecordPage'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<GroupsPage />} />
            <Route path="/groups" element={<GroupsPage />} />
            <Route path="/journal-entries" element={<JournalEntriesPage />} />
            <Route path="/send-and-record" element={<SendAndRecordPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App