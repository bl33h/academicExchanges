// https://mui.com/material-ui/react-app-bar/
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './NavBar.scss';
import Logo from '../../assets/images/logo.png';
import {useNavigate} from "react-router-dom";
import {supabase} from "../../supabase/client";

const pages = ['Estudiantes de Intercambio', 'Estudiantes', 'Universidades', 'Resumen',];
const settings = ['Perfil', 'Cerrar Sesión',];

function NavBar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const navigate = useNavigate();

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    const handleLogout = async () => {
        try {
            await supabase.auth.signOut().then(
                navigate("/")
            );
        } catch (error) {
            console.log('Error signing out:', error.message);
        }
    }

    const handleProfile = () => {
        navigate("/profile");
    }

    const handleUserMenuItemClick = (setting) => {
        switch (setting) {
            case 'Cerrar Sesión':
                return handleLogout;
            case 'Perfil':
                return handleProfile;
            default:
                return handleCloseUserMenu;
        }
    };

    // const handleHome = () => {
    //     navigate("/");
    // }

    const handleStudentsInExchanges = () => {
        navigate("/estudiantes-de-intercambio");
    }

    const handleStudents = () => {
        navigate("/estudiantes");
    }

    const handleUniversities = () => {
        navigate("/universidades");
    }

    const handleSummary = () => {
        navigate("/resumen");
    }

    const handleMenuClick = (page) => {
        switch (page) {
            case 'Estudiantes de Intercambio':
                return handleStudentsInExchanges;
            case 'Estudiantes':
                return handleStudents;
            case 'Universidades':
                return handleUniversities;
            case 'Resumen':
                return handleSummary;
            default:
                return handleCloseNavMenu;
        }
    }

    return (
        <AppBar position="static" sx={{bgcolor: '#9BBE43', marginBottom: '15px'}}>
            <Container maxWidth="xl" className={"nav-bar"}>
                <Toolbar disableGutters>
                    <Box sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}>
                        <img src={Logo} alt="Logo" className={'logo'}/>
                    </Box>
                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon sx={{color: 'black'}}/>
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={handleMenuClick(page)}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}>
                        <img src={Logo} alt="Logo" className={'logo'}/>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: {xs: 'flex', md: 'none'},
                            flexGrow: 1,
                        }}
                    />
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleMenuClick(page)}
                                sx={{my: 2, color: 'black', display: 'block', fontSize: '15px',}}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                <Avatar sx={{bgcolor: '#9BBE43',}}>
                                    <AccountCircleIcon sx={{color: 'black'}}/>
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{mt: '45px'}}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleUserMenuItemClick(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;