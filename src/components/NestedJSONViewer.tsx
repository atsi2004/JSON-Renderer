import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getUnionKeys(data: object[]): string[] {
  const keysSet = new Set<string>();
  data.forEach((obj) => {
    Object.keys(obj).forEach((key) => keysSet.add(key));
  });
  return Array.from(keysSet);
}

function generateColumns(data: object[]): GridColDef[] {
  const keys = getUnionKeys(data);
  return keys.map((key) => ({
    field: key,
    headerName: key,
    flex: 1,
    renderCell: (params) => {
      const value = params.value;
      if (Array.isArray(value) && value.every(isObject)) {
        return (
          <div style={{ width: '100%' }}>
            <NestedJSONViewer data={value} label={key} />
          </div>
        );
      } else if (isObject(value)) {
        return (
          <div style={{ width: '100%' }}>
            <NestedJSONViewer data={value} label={key} />
          </div>
        );
      }
      return String(value ?? '');
    },
  }));
}

const NestedJSONViewer = ({
  data,
  label,
}: {
  data: any;
  label: string;
}) => {
  if (Array.isArray(data) && data.every(isObject)) {
    // Custom handling for "orders" to avoid putting accordions inside DataGrid cells
    if (label === 'orders') {
      return (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {data.map((order: any, idx: number) => (
              <Accordion key={idx} defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Order ID: {order.orderId}</Typography>
                </AccordionSummary>
                <AccordionDetails style={{ paddingLeft: '1rem' }}>
                  <NestedJSONViewer data={order.items} label="items" />
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      );
    }

    const columns = generateColumns(data);
    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{label}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ maxHeight: 400, overflow: 'auto', width: '100%' }}>
            <DataGrid
              rows={data.map((row, idx) => ({ id: idx, ...row }))}
              columns={columns}
              autoHeight={false}
              hideFooter
              density="compact"
              sx={{
                '& .MuiDataGrid-virtualScroller': {
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                },
              }}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }

  if (isObject(data)) {
    return (
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>{label}</Typography>
        </AccordionSummary>
        <AccordionDetails style={{ paddingLeft: '1rem' }}>
          {Object.entries(data).map(([key, value], idx) => (
            <NestedJSONViewer key={idx} data={value} label={key} />
          ))}
        </AccordionDetails>
      </Accordion>
    );
  }

  return (
    <div
      style={{
        textAlign: 'left',
        paddingLeft: '1rem',
        marginBottom: '0.5rem',
      }}
    >
      <strong>{label}:</strong> {String(data)}
    </div>
  );
};

export default NestedJSONViewer;
