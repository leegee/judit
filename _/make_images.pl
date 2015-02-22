use strict;
use warnings;

use Image::Thumbnail;

my $dir = '_/img/';
my $DIR;
opendir $DIR, $dir;
foreach my $file (readdir $DIR){
    next if $file =~ /^\.+$/;
    next if $file =~ /_\d{3}\.png$/;
    my $path = $dir .'/'. $file;

    foreach my $size (qw( 200 400 4000)){
        my $new_path = $path . '_'.$size.'.png';
        warn "Do $path\n";
        if (! -e $new_path){
            new Image::Thumbnail(
                size       => $size,
                create     => 1,
                input      => $path,
                outputpath => $new_path
            );
            warn "\tOK\n";
        } else {
            warn "\talready done\n";
        }
    }
}


