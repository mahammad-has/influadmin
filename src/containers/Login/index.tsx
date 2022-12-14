import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
    Center,
    AppShell,
    Flex,
} from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ColorMode } from '../../Components/ColorMode';
import { useAuthProvider } from '../../provider/AuthProvider';

export function Login() {
    const { login } = useAuthProvider()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    return (
        <AppShell
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Container size={420} my={100} >
                <Title
                    align="center"
                    color={"blue"}
                    sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                >
                    Influadmin
                </Title>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <TextInput value={email} onChange={(e) => setEmail(e.target.value)} label="Email" placeholder="you@mantine.dev" required />
                    <PasswordInput value={password} onChange={({ target: { value } }) => setPassword(value)} label="Password" placeholder="Your password" required mt="md" />
                    <Group position="apart" mt="md">
                        <Checkbox label="Remember me" />
                        <Anchor<'a'> onClick={(event) => event.preventDefault()} href="#" size="sm">
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button
                        onClick={() => {
                            login({
                                email,
                                password
                            })
                        }}
                        disabled={email.length === 0 || password.length === 0} fullWidth mt="xl">
                        Sign in
                    </Button>
                </Paper>
                <Flex justify={"center"} mt="lg" align={"center"} w="full">
                    <ColorMode />
                </Flex>
            </Container>
        </AppShell>
    );
}