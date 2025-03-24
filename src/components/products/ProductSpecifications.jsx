import React from 'react';
import {
  Box,
  Typography,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SpecItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateX(5px)',
  }
}));

const SpecName = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? theme.palette.grey[800] 
    : theme.palette.grey[100],
  padding: theme.spacing(2),
  minWidth: '45%',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center'
}));

const SpecValue = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.background.paper,
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center'
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: `${theme.spacing(1)} 0`,
  '&:before': {
    display: 'none',
  },
  boxShadow: theme.shadows[1],
  borderRadius: theme.shape.borderRadius,
  '&.Mui-expanded': {
    margin: `${theme.spacing(1)} 0`,
    boxShadow: theme.shadows[3],
  }
}));

const ProductSpecifications = ({ specifications = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Group specifications by category if any
  const hasCategories = specifications.some(spec => spec.category);
  
  const groupedSpecs = hasCategories 
    ? specifications.reduce((groups, spec) => {
        const category = spec.category || 'General';
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(spec);
        return groups;
      }, {})
    : { 'General': specifications };
    
  if (specifications.length === 0) {
    return null;
  }
  
  return (
    <Box sx={{ mt: 2 }}>
      {isMobile ? (
        // Mobile-friendly specification layout
        <Box>
          {specifications.map((spec, index) => (
            <motion.div
              key={spec.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  mb: 2, 
                  overflow: 'hidden',
                  borderRadius: 1 
                }}
              >
                <Box sx={{ p: 1.5, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                  <Typography variant="subtitle2">
                    {spec.feature_name}
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2">
                    {spec.feature_value}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>
      ) : hasCategories ? (
        // Desktop with categories - Display as accordions
        Object.entries(groupedSpecs).map(([category, specs], index) => (
          <StyledAccordion 
            key={category}
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            defaultExpanded={index === 0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel-${category}-content`}
              id={`panel-${category}-header`}
              sx={{ bgcolor: 'background.default' }}
            >
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                {category}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Box>
                {specs.map((spec, i) => (
                  <motion.div
                    key={spec.id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <SpecItem>
                      <SpecName>
                        {spec.feature_name}
                      </SpecName>
                      <SpecValue>
                        {spec.feature_value}
                      </SpecValue>
                    </SpecItem>
                  </motion.div>
                ))}
              </Box>
            </AccordionDetails>
          </StyledAccordion>
        ))
      ) : (
        // Desktop without categories - Display as alternating rows
        <Box>
          {specifications.map((spec, index) => (
            <motion.div
              key={spec.id || index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <SpecItem>
                <SpecName>
                  {spec.feature_name}
                </SpecName>
                <SpecValue>
                  {spec.feature_value}
                </SpecValue>
              </SpecItem>
            </motion.div>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ProductSpecifications; 