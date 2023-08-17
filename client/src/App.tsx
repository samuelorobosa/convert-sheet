import './App.css'
import {
    Box,
    Button,
    Flex,
    Grid,
    HStack,
    Image,
    Input,
    InputGroup,
    Select,
    Tag,
    Text,
    useToast
} from "@chakra-ui/react";
import convertSheetLogo from "./assets/logos/Convertsheet_logo.svg";
import {CalendarIcon, CloseIcon, LockIcon} from "@chakra-ui/icons";
import {ChangeEvent, SetStateAction, useRef, useState} from "react";
import axios from "axios";
function App() {
    const toast = useToast({
        position: "top-right",
        isClosable: true

    });
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [convertedFile, setConvertedFile] = useState<String | null>(null);
    const [dateFieldName, setDateFieldName ] = useState<SetStateAction<any>>('');
    const [identifierName1, setIdentifierName1 ] = useState<SetStateAction<any>>('');
    const [identifierName2, setIdentifierName2 ] = useState<SetStateAction<any>>('');
    const [dateType, setDateType] = useState<SetStateAction<any>>('');
    const featuresData = [
        {
            header: 'The ICS file will work with your favourite calendar apps.',
            iconSet: () => Array.from({length: 8}).map((_, idx, array) => (
                <CalendarIcon
                    opacity={idx === (array.length - 2) ? '1':'.5'}
                    key={idx}
                    color="brand.primary"
                    w={8}
                    h={8}/>
                ))
        },
        {
            header: 'Your data is secure. No one except you will ever have access to your files. Not even us!',
            iconSet: () => Array.from({length: 8}).map((_, idx, array) => (
                <LockIcon
                    opacity={idx === (array.length - 2) ? '1':'.5'}
                    key={idx}
                    color="brand.primary"
                    w={8}
                    h={8}/>
            ))
        },
    ];
    const truncateData = (str:string, limit:number) =>  `${str.slice(0, limit)}...${str.slice(str.length - limit, str.length )}`;
    const handleFileUpload = (event:ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        setUploadedFile(file);
    };

    const handleClick = () => inputRef.current?.click();

    function clearFileInput(){
        setUploadedFile(null);
        if(inputRef.current) inputRef.current.value = '';

    }

    const handleFormSubmit = async () => {
        const url = `http://localhost:8000/file/upload`

        /**
         * Build Form Data
         */
        const formData = new FormData();
        formData.append('sheet', uploadedFile,  uploadedFile.name);
        formData.append('dateFieldName', dateFieldName);
        formData.append('dateType', dateType);
        formData.append('identifierName1', identifierName1);
        formData.append('identifierName2', identifierName2);


        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        try {
            const { data, status } = await axios.post(url, formData, config);
            toast({
                title: data.message,
                description: 'Proceed to download your file',
                duration: 5000,
                status: 'success',
            })
            setUploadedFile(null);
            setIdentifierName1('')
            setIdentifierName2('')
            setDateType('')
            setDateFieldName('')
            setConvertedFile(data.fileName);
            if (status !== 200){
                throw new Error(`Something went wrong`);
            }
        }
        catch (err) {
            toast({
                title: 'Something went wrong',
                description: err as string,
                duration: 5000,
                status: 'error',
            })

        }
    };

    function handleDownload(){
        const link = document.createElement('a');
        link.href = `http://localhost:8000/${convertedFile}.ics`;
        link.download = `${convertedFile}.ics`; // Set the desired file name
        link.click();
        setConvertedFile(null);
    }

    return (
    <>
        {/*Jumbotron*/}
        <Box as='header'>
            <Image src={convertSheetLogo} alt="Convert Sheet logo"/>
        </Box>
        <Box as="section" my="14" maxW='5xl' textAlign="left">
            <Text fontSize="7xl" lineHeight="normal" letterSpacing="tight" fontWeight='bold'>
                A <Text as="span" color="brand.primary">free </Text>
                XLS to ICS converter to <Text as="span" color="brand.primary">supercharge </Text>
                how you store data in your <Text as="span" color="brand.primary">calendar</Text>
            </Text>
            <InputGroup>
                <input
                    type='file'
                    hidden
                    onChange={handleFileUpload}
                    ref={inputRef}
                />
                <Button
                        onClick={convertedFile ? handleDownload : handleClick}
                        boxShadow="0px 8px 8px -4px rgba(25, 103, 210, 0.06), 0px 20px 24px -4px rgba(25, 103, 210, 0.1)"
                        colorScheme="blue"
                        textAlign="left" mt="14" fontSize="sm">
                     {convertedFile ? 'Download File':'Choose file to convert'}
                </Button>
            </InputGroup>
            {
                (uploadedFile && !convertedFile) &&
                    <>
                        <HStack  mt="8">
                            <Flex
                                pr={2}
                                borderRadius="md"
                                boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                                w="30%"
                                bg="brand.white"
                                justify="space-between"
                                alignItems="center">
                                <Tag color="brand.gray"
                                     bg="none"
                                     size="lg" variant='solid'>
                                    {truncateData(uploadedFile.name, 7)}
                                </Tag>
                                <CloseIcon onClick = {()=> clearFileInput()} sx={{cursor: 'pointer'}} boxSize={3}/>
                            </Flex>
                            <Text fontWeight="bold" color="brand.primary">
                                Uploaded
                            </Text>
                        </HStack>
                        <HStack mt={4} justifyContent="flex-start" columnGap=".5rem">
                            <Input onChange={(e) => setDateFieldName(e.target.value)}
                                   boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                                   value={dateFieldName}
                                   w="30%" border="none"
                                   bg="brand.white"
                                   placeholder="Enter name of date column" />

                            <Select onChange={(e:ChangeEvent<any>) => setDateType(e.target.value)}
                                    boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                                    border="none"
                                    value={dateType}
                                    w="30%"
                                    bg="brand.white"
                                    placeholder='Select Date Format'>
                                <option value='1'>Month/Date</option>
                                <option value='2'>Date/Month</option>

                            </Select>
                        </HStack>
                        <HStack mt={4} justifyContent="flex-start" columnGap=".5rem">
                            <Input onChange={(e) => setIdentifierName1(e.target.value)}
                                   boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                                   value={identifierName1}
                                   w="30%" border="none"
                                   bg="brand.white"
                                   placeholder="Enter name of first identifier" />

                            <Input onChange={(e) => setIdentifierName2(e.target.value)}
                                   boxShadow="0px 1px 2px 0px rgba(16, 24, 40, 0.05)"
                                   value={identifierName2}
                                   w="30%" border="none"
                                   bg="brand.white"
                                   placeholder="Enter name of second identifier" />

                            <Button loadingText='Converting'
                                    isLoading={false}
                                    onClick={handleFormSubmit}
                                    colorScheme="blue"
                                    isDisabled={!dateFieldName || !dateType || !identifierName1 || !identifierName2}>
                                Convert
                            </Button>
                        </HStack>
                    </>
            }
        </Box>

        {/*  Features section  */}
        <Grid
            minH="28rem"
            rowGap="14"
            columnGap="14"
            templateColumns='repeat(2, 1fr)'
            templateRows='repeat(2, 1fr)'>

            {
                featuresData.map((data, idx)=> {
                    return <Flex direction="column"
                                 justify="space-between"
                                 bg="white"
                                 pl="1rem"
                                 key={idx}
                                 py="2rem"
                                 borderRadius="md">
                        <Text
                            w="70%"
                            fontWeight="bold"
                            fontSize="xl"
                            textAlign="initial"
                            lineHeight="normal">
                            {data.header}
                        </Text>
                        <Flex justify="flex-end" gap="2rem" mt="10">
                            {data.iconSet()}
                        </Flex>
                    </Flex>
                })
            }
        </Grid>
    </>
  )
}

export default App
