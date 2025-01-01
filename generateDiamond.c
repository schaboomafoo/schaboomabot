#include<stdio.h>
#include<stdlib.h>
#include<time.h>
#include<string.h>
//generally i is row, j is col =/=/= diamond[row][col]


int** recursiveGeneration(int** previous, int n, int remaining);
void printArray(int **input, int size);
char* twitchMessage(int **input, int order);
char* colored(int **input, int order);

//arguments intended to be (order) or (file order #ofDiamonds)
int main(int argc, char* argv[]){
    int order;
    if(argc != 2)
        order = 4;
    else
        order=atoi(argv[1])-1;
    if(order < 0 || order >=11){
        printf("invalid order provided, must be integer between 2 and 11\n");
        return 0;
    }
    srand(time(NULL));

    int** base = (int**)malloc(2 * sizeof(int*));
    for (int i = 0; i < 2; i++){
        base[i] = (int*)malloc(2 * sizeof(int));
        for (int j = 0; j < 2; j++){
            base[i][j] = 0; // Initialize base with -1
        }
    }

    int** tiling = recursiveGeneration(base, 0, order);

    //printArray(tiling, order*2+2);
    
    char result[501];

    //fill string
    printf("%s\n", colored(tiling, order));


    for(int i=0; i<order*2+2; i++){
        free(tiling[i]);
    }
    free(tiling);
}

//start with array of all zeros (ZERO MEANS HOLE -1 MEANS BOUNDARY)
//when you expand the array, you need to find the surroundings of all vertices that 
//aren't 0 (-1 = empty, every other number is a domino)
//if the vetex value isn't -1, check surrounding vertices, make them 0 (expanding process changes boundaries)


//when iterations is 0, the array size is [0+2][0+2]
//n [2n+2][2+2]
int** recursiveGeneration(int** previous, int n, int remaining){
    int len=n*2+2; //length and width of inserted (previous array)
    //generate new array to enlarge and eventually fill / transfer

    
    //fill holes left from previous
    for(int i = 0; i<len; i++){
        for(int j = 0; j<len; j++){
            if(previous[i][j]==0){ //hole has been reached when going from top left to bottom right
                //coin flip for domino block
                if(rand()%2){   //two horizontal
                    previous[i][j]   = 1; previous[i][j+1]   = 3;
                    previous[i+1][j] = 1; previous[i+1][j+1] = 3;
                }
                else{           //two vertical
                    previous[i][j]   = 2; previous[i][j+1]   = 2;
                    previous[i+1][j] = 4; previous[i+1][j+1] = 4;
                }
            }
        }
    }

    //holes filled, check if recursion is complete
    if(remaining == 0) {
        return previous;
    }


    int** inflated = (int**)malloc((len+2) * sizeof(int*));
    for (int i = 0; i < len+2; i++) {
        inflated[i] = (int*)malloc((len+2) * sizeof(int));
        for (int j = 0; j < len+2; j++) {
            inflated[i][j] = -1; //full of boundary initially
        }
    }

    //destruction step
    //iterate from top left to bottom right, check each horizontal domino if it's south
    //if it's south, check if the domino directly below it is also horizontal, if so, delete the block
    //(stop this checking at the bottom row since you're done)

    //then do the same thing, scanning from top left to bottom right (skipping rightmost col)
    //if it's an east domino, check if the domino directly to the right is vertical as well
    //if so, delete it

    //destroying bad horizontal blocks
    for(int i=0; i<len-1; i++){ //doesn't scan bottom row
        for(int j=0; j<len; j++){
            if(previous[i][j]==1 && previous[i+1][j]==1 && (i+j)%2 != n%2){ //(i+j)%2 != n%2 means SOUTH domino
                previous[i][j]   = 0; previous[i][j+1]   = 0;
                previous[i+1][j] = 0; previous[i+1][j+1] = 0;
            }
        }
    }

    //destroying bad vertical blocks
    //check if an east domino has a west domino to the right
    for(int i=0; i<len; i++){
        for(int j=0; j<len-1; j++){ //doesn't scan rightmost column
            if(previous[i][j]==2 && previous[i][j+1]==2 && (i+j)%2 != n%2){ //(i+j)%2 != n%2 means EAST domino
                previous[i][j]   = 0; previous[i][j+1]   = 0;
                previous[i+1][j] = 0; previous[i+1][j+1] = 0;
            }
        }
    }

    n++;

    //inflation step, inserting old array into new
    for(int i=0; i<len; i++){
        for(int j=0; j<len; j++){

            if(previous[i][j]!=-1) //insert previous dominos in middle of new inflation
                inflated[i+1][j+1] = previous[i][j];

            //change surrounding tiles of non boundaries to new non-boundaries
            if(previous[i][j]!=-1){ //if inserted diamond isn't at a boundary point
            
                if(inflated[i][j+1]==-1) //and inflatd diamond scan point isn't already marked as non-boundary
                    inflated[i][j+1] = 0; //then change the inflated diamond point to empty non-boundary
                
                if(inflated[i+1][j+2]==-1)
                    inflated[i+1][j+2] = 0;
                
                if(inflated[i+2][j+1]==-1)
                    inflated[i+2][j+1] = 0;
                
                if(inflated[i+1][j]==-1)
                    inflated[i+1][j] = 0;          
            }
        }
    }

    //shuffling step

    int** inflatedShuff = (int**)malloc((len+2) * sizeof(int*));
    for (int i = 0; i < len+2; i++) {
        inflatedShuff[i] = (int*)malloc((len+2) * sizeof(int));
        for (int j = 0; j < len+2; j++) {
            inflatedShuff[i][j] = 0; //full of (empty)
        }
    }

    //move dominos into second array temporarily to avoid issues from overlapping dominos
    for(int i=1; i<len+1; i++){
        for(int j=1; j<len+1; j++){
                //moving north up
            if(inflated[i][j]==1 && (i+j)%2 != n%2){ //not sure if last condition is ever required
                inflatedShuff[i-1][j] = 1; inflatedShuff[i-1][j+1] = 3;
            }

            //moving east right
            else if(inflated[i][j]==2 && (i+j)%2 == n%2){
                inflatedShuff[i][j+1]   = 2;
                inflatedShuff[i+1][j+1] = 4;
            }

            //moving south down
            else if(inflated[i][j]==1 && (i+j)%2 == n%2){
                inflatedShuff[i+1][j] = 1; inflatedShuff[i+1][j+1] = 3;
            }

            //moving west left
            else if(inflated[i][j]==2 && (i+j)%2 != n%2){
                inflatedShuff[i][j-1]   = 2;
                inflatedShuff[i+1][j-1] = 4;
            }
        }
    }
    //transferring from shuffled to inflated
    for(int i=0; i<len+2; i++){
        for(int j=0; j<len+2; j++){
            if(inflated[i][j]!=-1)
                inflated[i][j]=inflatedShuff[i][j];
        }
    }

    //freeing arrays
    for(int i=0; i<len; i++){
        free(previous[i]);
    }
    free(previous);

    for(int i=0; i<len+2; i++){
        free(inflatedShuff[i]);
    }
    free(inflatedShuff);

    return recursiveGeneration(inflated, n, --remaining);
}


void printArray(int **input, int size){
    for(int i=0; i<size;i++){
        for(int j=0; j<size;j++){
            if(input[i][j] == -1)
                printf("[XXX] ");
            else if(input[i][j] == 0)
                printf("[   ] ");
            else
                printf("[ %d ] ",input[i][j]);
        }
        printf("\n");
    }
    printf("\n");
}

//Y north, R west, G east, B south
//for now this is going to be destroyed and replaced with more generic code, then the context will be added in js
char* twitchMessage(int **input, int order){
    printf("%d is the 'order'\n",order);

    if(order > 7)
        return("this diamond is too large to display in twitch chat\n");
    else if(order < 1)
        return("this diamond is too small to display in twitch chat\n");

    char *result = malloc(501);
    if (result == NULL) {
        perror("Failed to allocate memory");
        exit(EXIT_FAILURE);
    }

    result[0] = '\0';

    if(order == 1)
        strcat(result, "_ _ ");
    else if(order == 2)
        strcat(result, "_ _ _ ");
    else if(order == 3)
        strcat(result, "_ _ _ _ _ ");
    else if(order == 4)
        strcat(result, "_ _ _ _ _ _ _ _ ");
    else if(order == 5)
        strcat(result, "_ _ _ _ _ _ _ _ _ _ _ ");
    else if(order == 6)
        strcat(result, "_ _ _ _ _ _ _ _ _ _ _ _ _ _ ");
    else //max (true order 8)
        strcat(result, "_ _ ");



    int started = 0; //don't start adding to the string until you actually reach the content, since the 'prefix' is fixed for each order
    for(int i=0; i<order*2+2; i++){
        for(int j=0; j<order*2+2; j++){
            if(input[i][j]!=-1)
                started=1;

            if(!started);
            else if(input[i][j] == -1)
                strcat(result, "_");
            else if((input[i][j]==1 && ((i+j)%2!=order%2)) || input[i][j]==3 && ((i+j)%2==order%2)){ //blue (south)
                if((i+j)%2==order%2)
                    strcat(result, "D");
                else
                    strcat(result, "S");
            }
            else if((input[i][j]==1 && ((i+j)%2==order%2)) || input[i][j]==3 && ((i+j)%2!=order%2)){ //yellow (north)
                if((i+j)%2==order%2)
                    strcat(result, "G");
                else
                    strcat(result, "H");
            }
            else if((input[i][j]==2 && ((i+j)%2!=order%2)) || input[i][j]==4 && ((i+j)%2==order%2)){ //green (east)
                if((i+j)%2==order%2)
                    strcat(result, "V");
                else
                    strcat(result, "T");
            }
            else if((input[i][j]==2 && ((i+j)%2==order%2)) || input[i][j]==4 && ((i+j)%2!=order%2)){ //red (west)
                if((i+j)%2==order%2)
                    strcat(result, "R");
                else
                    strcat(result, "C");
            }


            if(strlen(result) >= 499)
                return result;
            else if(started)
                strcat(result, " ");
        }
    }

    return result;
}


char* colored(int **input, int order){
    char *result = malloc((order*2+2) * ((order*2+2) * 5 + 1)); //each square separated by spaces with null terminator
    if (result == NULL) {
        perror("Failed to allocate memory");
        exit(EXIT_FAILURE);
    }

    if(order >= 11)
        return "as of right now nop";

    for(int i=0; i<order*2+2; i++){
        for(int j=0; j<order*2+2; j++){

            if(input[i][j] == -1)
                strcat(result, "⠀");
            else if((input[i][j]==1 && ((i+j)%2!=order%2)) || input[i][j]==3 && ((i+j)%2==order%2)){ //blue (south)
                if((i+j)%2==order%2)
                    strcat(result, "⠒");
                else
                    strcat(result, "⠒");
            }
            else if((input[i][j]==1 && ((i+j)%2==order%2)) || input[i][j]==3 && ((i+j)%2!=order%2)){ //yellow (north)
                if((i+j)%2==order%2)
                    strcat(result, "⠒");
                else
                    strcat(result, "⠒");
            }
            else if((input[i][j]==2 && ((i+j)%2!=order%2)) || input[i][j]==4 && ((i+j)%2==order%2)){ //green (east)
                if((i+j)%2==order%2)
                    strcat(result, "⠸");
                else
                    strcat(result, "⠸");
            }
            else if((input[i][j]==2 && ((i+j)%2==order%2)) || input[i][j]==4 && ((i+j)%2!=order%2)){ //red (west)
                if((i+j)%2==order%2)
                    strcat(result, "⠸");
                else
                    strcat(result, "⠸");
            }

            //NSEW ⠉⠤⠸⠇
            //⠒⠸⠀
            //strcat(result, " ");


            //if(strlen(result) >= (order*2+2) * ((order*2+2) * 5 + 1))
            if(strlen(result) >= 1450)
                return result;
        }
        strcat(result, "\n");
    }

    return result;
}

//create program to save several strings to a file, 
//specifically strings that demonstrate the domino shuffling algorithm
//to keep everything in place so that it looks good while it's cycling, add filler on all sides of the diamond
//so that as it "expands" it's actually expanding from the center, 
//go from order 0 to order 11 (since that's the biggest i can show in chat with ascii)

//edit this to be simply like a library function call, then based on input, modify output in js
//like > order 8? convert all values to ascii equivalents (up to order 11)

//create separate(?) file to output each step (maybe just a flag)
//then write each step to a file
//the cycle through the strings to visualize the algorithm, long delay between frames
//be able to use ascii or emotes, add special emote for void space?
//with ascii draw initial 2x2 in the middle where the center ends up for order 11