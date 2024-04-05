import { Route, Routes } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { EntryForm } from './pages/EntryForm';
import { EntryList } from './pages/EntryList';
import { NotFound } from './pages/NotFound';
import { useEntries } from './data';
import './App.css';
export default function App() {
  const { addEntry, modifyEntry, removeEntry } = useEntries();
  return (
    <Routes>
      <Route path="/" element={<NavBar />}>
        <Route index element={<EntryList />} />
        <Route
          path="details/:entryId"
          element={
            <EntryForm
              addEntry={addEntry}
              removeEntry={removeEntry}
              modifyEntry={modifyEntry}
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
