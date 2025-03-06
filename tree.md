#### Component Tree

           |----------- app --------------|
           |             |                |
           |             |                |
           |             |                |
         (main)      (policies)       (publish)
           |             |                |
           |             |                |
           |             |                |
         /logs       /policies          /logs
           |                              |
           |                              |
           |
           ----- LogsLayout
                    |
                Provider
                    |    
                PSNavbarProvider                
                    | 
                  Layout.tsx
                    |
                AppLayout           
                    |                          
                /       \
            Sidebar      Main
                    |     |
                        PSBanner | PSNavbar

                
                PreviewPage (/id)                 /id
                    |                              |

           |                              |
           |                              |

### routes
           |----------- app --------------|
           |             |                |
           |             |                |
           |             |                |
         (main)      (policies)       (publish)
           |             |                |
           |             |                |
           |             |                |
         /logs       /policies          /logs
           |                              |
           |                              |
           |                              |
          /id                            /id
           |                              |
           |                              |
           |                              |