import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneIcon from '@mui/icons-material/Phone'
import {
  Box,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'

import { Logo } from './Logo'
import {
  contactColSx,
  footerContainerSx,
  footerSx,
  linksColSx,
  listItemIconSx,
  listItemSx,
  logoColSx,
  logoSx,
} from './PageFooter.styles'

export type PageFooter = Record<string, never>

const DUMMY_DATA = {
  contact: 'Contact',
  streetAndCity: 'Streetname,City',
  mailto: 'mailto:info@eprtool.example',
  email: 'info@eprtool.jd',
  tel: 'tel:+962 790 855 826',
  phone: 'tel:+962 790 855 826',
  links: ['Link 1', 'Link 2', 'Link 3'],
}

export const PageFooter = () => {
  return (
    <Box component={'footer'} sx={footerSx}>
      <Box sx={footerContainerSx}>
        <Box sx={logoColSx}>
          <Logo sx={logoSx} />
        </Box>
        <Box sx={contactColSx}>
          <Typography variant={'h3'}>{DUMMY_DATA.contact}</Typography>
          <List>
            <ListItem disableGutters sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <LocationOnIcon fontSize={'small'} sx={listItemSx} />
              </ListItemIcon>
              <ListItemText> {DUMMY_DATA.streetAndCity} </ListItemText>
            </ListItem>
            <ListItem
              disableGutters
              component={Link}
              underline={'hover'}
              target={'_blank'}
              sx={listItemSx}
              href={DUMMY_DATA.mailto}
            >
              <ListItemIcon sx={listItemIconSx}>
                <EmailIcon fontSize={'small'} sx={listItemSx} />
              </ListItemIcon>
              <ListItemText> {DUMMY_DATA.email} </ListItemText>
            </ListItem>
            <ListItem
              disableGutters
              component={Link}
              underline={'hover'}
              sx={listItemSx}
              href={DUMMY_DATA.tel}
            >
              <ListItemIcon sx={listItemIconSx}>
                <PhoneIcon fontSize={'small'} sx={listItemSx} />
              </ListItemIcon>
              <ListItemText> {DUMMY_DATA.phone} </ListItemText>
            </ListItem>
          </List>
        </Box>
        <Box sx={linksColSx}>
          <Typography
            sx={{ visibility: 'hidden', display: { xs: 'none', sm: 'block' } }}
            aria-hidden
          >
            &nbsp;
          </Typography>
          <List>
            {DUMMY_DATA.links.map((label) => {
              return (
                <ListItem
                  key={label}
                  disableGutters
                  sx={listItemSx}
                  component={Link}
                  underline={'hover'}
                  target={'_blank'}
                  href={'#'}
                >
                  <ListItemText> {label} </ListItemText>
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Box>
    </Box>
  )
}
