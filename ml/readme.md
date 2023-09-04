# Steps to setup this environment
1. Install python, pip and anaconda on your machine
2. Open anaconda prompt (installed with anaconda)
3. Navigate to this folder
4. Setup the virtual environment
    - For vscode.
        1. Ctrl + Shift + P to open the command palette
        2. Run the "Python: Create environment" command.
        3. Choose to create a new conda environment
        4. After the process is done you should have a new .conda directory in this directory
5. In ancaonda prompt, list out the conda environments using 'conda info --envs'. You should now have the base conda installation along with another unaliased environment.
6. Switch to this environment by using 'conda activate *env-directory-here*'
7. To confirm that directory has been switched, check the prompt label in Anaconda Prompt. should be labelled with '(env-directory-here)'. Also use conda info --envs to check which env is selected.
8. Check the currently installed packages with 'pip list'
9. Install the required packages using 'pip install -r requirements.txt'
10. Note that you should use pip for any installation commands
11. Make sure the selected python intepreter in vscode is the virtual env one. 
12. Try running server or notebooks

# Resources used
- https://realpython.com/k-means-clustering-python/
- https://s3.amazonaws.com/assets.datacamp.com/production/course_10628/slides/chapter3.pdf
- https://stackabuse.com/hierarchical-clustering-with-python-and-scikit-learn/
- https://stats.stackexchange.com/questions/195446/choosing-the-right-linkage-method-for-hierarchical-clustering/217742#217742  
- https://stats.stackexchange.com/questions/81539/what-data-structure-to-use-for-my-cluster-analysis-or-what-cluster-analysis-to-u