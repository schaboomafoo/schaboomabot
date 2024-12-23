#include <stdio.h>
#include <stdlib.h>
#include <time.h>
//generally i is row, j is col =/=/= diamond[row][col]


int** recursiveGeneration(int** previous, int n, int remaining);
void printArray(int **input, int size);


int main(int argc, char* argv[]){
    int order=atoi(argv[1]);

    int** base = (int**)malloc(2 * sizeof(int*));
    for (int i = 0; i < 2; i++){
        base[i] = (int*)malloc(2 * sizeof(int));
        for (int j = 0; j < 2; j++){
            base[i][j] = 0; // Initialize base with -1
        }
    }

    printArray(base, 2);

    srand(time(NULL));

    int** tiling = recursiveGeneration(base, 0, order);

    printArray(tiling, order*2+2);
    
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
                if(i == len-1 || j == len-1) { // FIXME: remove
                    printf("\n\n\n\n\n\n\n\n\nBALD RETARDDDDDDDDDDDDDDDDDDDDDD\n");
                    printArray(previous, len);
                    printf("\n\n\n\n\n\n");
                }
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

    printf("ORDER %d AFTER INSERTION STEP: \n",n);
    printArray(previous, len);

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

    //then do the same shit scanning from top left to bottom right (skipping rightmost col)
    //if it's an east domino, check if the domino directly to the right is vertical as well
    //if so, delete it

    //destroying bad horizontal blocks
    for(int i=0; i<len-1; i++){ //doesn't scan bottom row
        for(int j=0; j<len; j++){
            if(previous[i][j]==1 && previous[i+1][j]==1 && (i+j)%2 != n%2){ //(i+j)%2 != n%2 means SOUTH domino
                if(j == len-1) { // FIXME: remove
                    printf("\n\n\n\n\n\n\n\nSHORT RETARDDDDDDDDDDDDDDDDDDDDDD\n");
                    printArray(previous, len);
                    printf("\n\n\n\n\n\n");
                }
                previous[i][j]   = 0; previous[i][j+1]   = 0;
                previous[i+1][j] = 0; previous[i+1][j+1] = 0;
            }
        }
    }

    printf("ORDER %d AFTER DELTION STEP 1: \n",n);
    printArray(previous, len);

    //destroying bad vertical blocks
    //check if an east domino has a west domino to the right
    for(int i=0; i<len; i++){
        for(int j=0; j<len-1; j++){ //doesn't scan rightmost column
            if(previous[i][j]==2 && previous[i][j+1]==2 && (i+j)%2 != n%2){ //(i+j)%2 != n%2 means EAST domino
                if(i == len-1) { // FIXME: remove
                    printf("\n\n\n\n\n\n\n\nSCHA KILLED WOW RETARDDDDDDDDDDDDDDDDDDDDDD\n");
                    printArray(previous, len);
                    printf("\n\n\n\n\n\n");
                }
                previous[i][j]   = 0; previous[i][j+1]   = 0;
                previous[i+1][j] = 0; previous[i+1][j+1] = 0;
            }
        }
    }

    printf("ORDER %d AFTER DELETION STEP 2: \n",n);
    printArray(previous, len);

    //printf("THIS IS THE INITIAL INFLATION ARRAY BEFORE PUTTING THE OLD DOMINOS IN: \n");
    //printArray(inflated, len+2);

    n++;


    //printf("POWER GAP POWER GAP POWER GAP \nPOWER GAP POWER GAP POWER GAP \nPOWER GAP POWER GAP POWER GAP \n\n\n");
    //inflation step, inserting old array into new
    for(int i=0; i<len; i++){
        for(int j=0; j<len; j++){
            //printf("I'm scanning the element in row %d and col %d of the 'previous' array...\n",i,j);

            if(previous[i][j]!=-1)
                inflated[i+1][j+1] = previous[i][j];
            //change surrounding tiles of non boundaries to new non-boundaries
            if(previous[i][j]!=-1){ //if inserted diamond isn't at a boundary point
                //printf("IM IN THE LOOP NOW!\n"); //2,1
                if(inflated[i][j+1]==-1){ //and inflatd diamond scan point isn't already marked as non-boundary
                    inflated[i][j+1] = 0; //then change the inflated diamond point to empty non-boundary
                    //printf("a zero was placed in inflated at i: %d j: %d\n",i,j+1);
                }
                if(inflated[i+1][j+2]==-1){
                    inflated[i+1][j+2] = 0;
                    //printf("a zero was placed in inflated at i: %d j: %d\n",i+1,j+2);
                }
                if(inflated[i+2][j+1]==-1){
                    inflated[i+2][j+1] = 0;
                    //printf("a zero was placed in inflated at i: %d j: %d\n",i+2,j+1);
                }
                if(inflated[i+1][j]==-1){
                    inflated[i+1][j] = 0;
                    //printf("a zero was placed in inflated at i: %d j: %d\n",i+1,j);
                }

                //printf("this is what the inflated array looks like after the loop!\n");
                //printArray(inflated,len+2);
            }

            //printArray(inflated,len+2);
        }
    }
    //printf("\n\n\nPOWER GAP POWER GAP POWER GAP \nPOWER GAP POWER GAP POWER GAP \nPOWER GAP POWER GAP POWER GAP \n\n\n");


    printf("ORDER %d AFTER INFLATION STEP: \n",n);
    printArray(inflated, len+2);


    //shuffling step (likely inefficient method)
    //ok this is dank, but 5-8 now represents dominos that have moved once already
    //since some will be blocked by future moving dominos, multiple iterations are required
    int done = 0;//bool
    while(!done){
        done=1;
        for(int i=1; i<len+1; i++){
            for(int j=1; j<len+1; j++){
                 //moving north up
                if(inflated[i][j]==1 && (i+j)%2 != n%2 && inflated[i-1][j] == 0 && inflated[i-1][j+1] == 0){ //not sure if last condition is ever required
                    done=0;
                    inflated[i-1][j] = 5; inflated[i-1][j+1] = 7;
                    inflated[i][j]   = 0; inflated[i][j+1]   = 0;
                }

                //moving east right
                if(inflated[i][j]==2 && (i+j)%2 == n%2 && inflated[i][j+1] == 0 && inflated[i+1][j+1] == 0){
                    done=0;
                    inflated[i][j]   = 0; inflated[i][j+1]   = 6;
                    inflated[i+1][j] = 0; inflated[i+1][j+1] = 8;
                }

                //moving south down
                if(inflated[i][j]==1 && (i+j)%2 == n%2 && inflated[i+1][j] == 0 && inflated[i+1][j+1] == 0){
                    done=0;
                    inflated[i][j]   = 0; inflated[i][j+1]   = 0;
                    inflated[i+1][j] = 5; inflated[i+1][j+1] = 7;
                }

                //moving west left
                if(inflated[i][j]==2 && (i+j)%2 != n%2 && inflated[i][j-1] == 0 && inflated[i+1][j-1] == 0){
                    done=0;
                    inflated[i][j-1]   = 6; inflated[i][j]   = 0;
                    inflated[i+1][j-1] = 8; inflated[i+1][j] = 0;
                }
            }
        }

        printf("ORDER %d AFTER A SHUFFLING ITERATION STEP: \n",n);
        printArray(inflated, len+2);
    }

    //now finally correcting from 5-8 to 1-4 again
    for(int i=0; i<len+2; i++){
        for(int j=0; j<len+2; j++){
            if(inflated[i][j]!=-1 && inflated[i][j]!=8 && inflated[i][j]!=4)
                inflated[i][j] = inflated[i][j]%4;
            else if(inflated[i][j]==8)
                inflated[i][j] = 4;
        }
    }

    printf("ORDER %d AFTER SHUFFLING COMPLETION: \n",n);
    printArray(inflated, len+2);


    for(int i=0; i<len; i++){
        free(previous[i]);
    }
    free(previous);

    return recursiveGeneration(inflated, n, --remaining);
}


void printArray(int **input, int size){
    for(int i=0; i<size;i++){
        for(int j=0; j<size;j++){
            if(input[i][j] == -1)
                printf("[XXX] ");
            else if(input[i][j] == 0)
                printf("[   ] ");
            else if(((input[i][j] == 1 || input[i][j] == 5) && (i+j)%2==0) || ((input[i][j]==3 || input[i][j]==7) && (i+j)%2==1))
                printf("[ N ] ");
            else if(((input[i][j] == 1 || input[i][j] == 5) && (i+j)%2==1) || ((input[i][j]==3 || input[i][j]==7) && (i+j)%2==0))
                printf("[ S ] ");
            else if(((input[i][j] == 2 || input[i][j] == 6) && (i+j)%2==0) || ((input[i][j]==4 || input[i][j]==8) && (i+j)%2==1))
                printf("[ W ] ");
            else if(((input[i][j] == 2 || input[i][j] == 6) && (i+j)%2==1) || ((input[i][j]==4 || input[i][j]==8) && (i+j)%2==0))
                printf("[ E ] ");
        }
        printf("\n");
    }
    printf("\n");
}