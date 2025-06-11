// ** React Imports
import { createTheme, ThemeProvider } from '@mui/material'
import { useEffect, useState, createContext } from 'react'
import { useSkin } from '@hooks/useSkin'

const ThemeColors = createContext()

const ThemeContext = ({ children }) => {
  const [colors, setColors] = useState({})
  const { skin } = useSkin()

  useEffect(() => {
    if (window !== 'undefined') {
      //** Get variable value
      const getHex = color => window.getComputedStyle(document.body).getPropertyValue(color).trim()

      //** Colors obj
      const obj = {
        primary: {
          light: getHex('--bs-primary').concat('1a'),
          main: getHex('--bs-primary')
        },
        table: {
          light: "#fff",
        },
        secondary: {
          light: getHex('--bs-secondary').concat('1a'),
          main: getHex('--bs-secondary')
        },
        success: {
          light: getHex('--bs-success').concat('1a'),
          main: getHex('--bs-success')
        },
        danger: {
          light: getHex('--bs-danger').concat('1a'),
          main: getHex('--bs-danger')
        },
        warning: {
          light: getHex('--bs-warning').concat('1a'),
          main: getHex('--bs-warning')
        },
        info: {
          light: getHex('--bs-info').concat('1a'),
          main: getHex('--bs-info')
        },
        dark: {
          light: getHex('--bs-dark').concat('1a'),
          main: getHex('--bs-dark')
        }
      }

      setColors({ ...obj })
    }
  }, [])

  const theme = createTheme({
    palette: {
      mode: skin,
      primary: {
        main: colors?.primary?.main || "#1976d2",
        light: colors?.primary?.light || "#BBDEFB",
      },
      secondary: {
        main: colors?.secondary?.main || "#9c27b0",
      },
      background: {
        default: skin === "light" ? "#fff" : '#202544',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: skin === "light" ? "#f9f9f9" : "#202544",
            color: skin === "light" ? "#000" : "#fff",
          }
        }
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            bgcolor: skin === "light" ? "#1E1E1E" : "#1E1E1E",
            color: skin === "light" ? "#000" : "#fff",
          },
          columnHeaders: {
            bgcolor: skin === "light" ? "#f00" : "#202544",
            color: skin === "light" ? "#000" : "#fff",
            borderBottom: "1px solid #ccc",
          },
          cell: {
            color: skin === "light" ? "#000" : "#fff",
          },
          row: {
            '&:hover': {
              backgroundColor: colors?.primary?.light || "#f5f5f5",
            }
          }
        }
      },
      MuiTablePagination: {
        styleOverrides: {
          toolbar: {
            backgroundColor: skin === "light" ? "#f9f9f9" : "#202544",
            color: skin === "light" ? "#000" : "#fff",
          },
          selectLabel: {
            margin: "0 !important",
          },
          displayedRows: {
            margin: "0 !important",
          },
        }
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: '0 !important',

          }
        }
      }
    }
  })

  return (
    <ThemeColors.Provider value={{ colors }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeColors.Provider>
  )
}

export { ThemeColors, ThemeContext }
