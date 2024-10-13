import React, { useState, useRef, useEffect } from 'react';
import { ChakraProvider, Box, VStack, Input, Button, Heading, AspectRatio, IconButton, useToast, Spinner, Container, Flex, useMediaQuery } from '@chakra-ui/react';
import { FaExpand, FaCompress } from 'react-icons/fa';

function App() {
  const [url, setUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const toast = useToast();

  const [isMobile] = useMediaQuery("(max-width: 480px)");
  const [isTablet] = useMediaQuery("(min-width: 481px) and (max-width: 1024px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const extractedVideoId = extractVideoId(url);
    if (extractedVideoId) {
      setVideoId(extractedVideoId);
      // Simulate API call or video loading
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      toast({
        title: 'Invalid YouTube URL',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  return (
    <ChakraProvider>
      <Flex minHeight="100vh" bg="gray.100" direction="column" align="center" justify="center">
        <Container maxW={isMobile ? "100%" : isTablet ? "90%" : "80%"} py={[4, 6, 8]} px={[2, 4, 6]}>
          <VStack spacing={[4, 6, 8]} width="100%">
            <Heading as="h1" size={["md", "lg", "xl"]} textAlign="center">YouTube Video Player</Heading>
            <Box as="form" onSubmit={handleSubmit} width="100%">
              <Flex direction={isMobile ? "column" : "row"} width="100%">
                <Input
                  placeholder="Enter YouTube URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  mr={isMobile ? 0 : 2}
                  mb={isMobile ? 2 : 0}
                  flex={1}
                />
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  width={isMobile ? "100%" : "auto"}
                >
                  Load Video
                </Button>
              </Flex>
            </Box>
            {videoId && (
              <Box position="relative" width="100%" ref={containerRef}>
                <AspectRatio ratio={16 / 9} width="100%" maxW={isMobile ? "100%" : isTablet ? "90%" : "800px"} mx="auto">
                  {isLoading ? (
                    <Spinner size="xl" />
                  ) : (
                    <iframe
                      ref={videoRef}
                      title="YouTube video player"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      allowFullScreen
                      loading="lazy"
                      width="100%"
                      height="100%"
                    />
                  )}
                </AspectRatio>
                <IconButton
                  icon={isFullScreen ? <FaCompress /> : <FaExpand />}
                  aria-label="Toggle full-screen"
                  position="absolute"
                  bottom={2}
                  right={2}
                  onClick={toggleFullScreen}
                  zIndex={1}
                />
              </Box>
            )}
          </VStack>
        </Container>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
