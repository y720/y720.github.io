BEGIN { 
} 
{ 
    if(length($0) > 0) {
	print $0 ".";
	cmd = "say -v Ting-Ting -r 100 -o ../mp3/" $0 ".m4a " $0 "";
	print cmd
	system(cmd);
    }
}


