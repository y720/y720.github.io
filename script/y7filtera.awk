BEGIN { 
} 
{ 
    if(length($0) > 0) {
	print $0 ".";
    }
}


