import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { isPrimitive, isObject, isArrayOfObjects } from './ObjectOrPrimitive';



type JSONValue = string | number | boolean | null | JSONValue[] | JSONObject; 
interface JSONObject {
  [key: string]: JSONValue;
}


// Component
const NestedJSONViewer = ({ data, label }: { data: any; label?: string }) => { 
  if (!data || typeof data !== 'object') return null;

  // Filtering data to get entries
  const entries = Object.entries(data);


  // Collecting primitive values and their keys
  const primitiveEntries = entries.filter(([_, value]) => isPrimitive(value)); // Filtering primitive values 
  const rows = primitiveEntries.map(([key, value], index) => ({ // Mapping to rows 
    id: index,
    key,
    value: String(value),
  }));

  
  const columns: GridColDef[] = [ // Defining columns for DataGrid
    { field: 'key', headerName: 'Key', width: 150 },
    { field: 'value', headerName: 'Value', width: 300 },
  ];

  // Render nested objects or arrays recursively as nested
  const nestedViews = entries
    .filter(([_, value]) => !isPrimitive(value)) // If value is not primitive
    .map(([key, value]) => {
      if (isObject(value)) {
        return <NestedJSONViewer key={key} data={value} label={key} />; // Return nested component for objects
      }

      if (Array.isArray(value)) { //Array logic
        if (isArrayOfObjects(value)) { // Check if array contains objects
          // If array contains objects, create a DataGrid for them
          // Union all keys from all objects
          const allKeys = Array.from(
            new Set(value.flatMap((item) => Object.keys(item))) // Collecting all keys from objects
          );

          const cols: GridColDef[] = allKeys.map((key) => ({ // Creating columns for DataGrid
            field: key,
            headerName: key,
            width: 150,
          }));

          const rows = value.map((item, index) => ({ // Mapping array items to rows
            id: index,
            ...item, 
          }));
          
          // Return an Accordion with DataGrid for the array of objects
          return (
            <Accordion key={key} defaultExpanded> 
              <AccordionSummary expandIcon={<ExpandMoreIcon />}> 
                <Typography>{key}</Typography> 
              </AccordionSummary> 
              <AccordionDetails>
                <div style={{ height: rows.length * 52 + 56, width: '100%', marginBottom: '1rem' }}>
                  <DataGrid rows={rows} columns={cols} hideFooter /> 
                </div>
              </AccordionDetails>
            </Accordion>
          );
        } else {
          // If array is not of objects, display it as a raw array
          return (
            <Accordion key={key} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{key} (raw array)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{JSON.stringify(value, null, 2)}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        }
      }

      return null;
    });

  return ( // Anatomy
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{label || 'Root'}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {rows.length > 0 && (
          <div style={{ height: rows.length * 52 + 56, width: '100%', marginBottom: '1rem' }}>
            <DataGrid rows={rows} columns={columns} hideFooter />
          </div>
        )}
        {nestedViews}
      </AccordionDetails>
    </Accordion>
  );
};

export default NestedJSONViewer;
